import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Theater } from "@/models/Theater";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id: venueId } = await params;
    const { name, capacity, categories } = await req.json();

    if (!name || !capacity) {
      return NextResponse.json({ error: "Screen name and capacity are required" }, { status: 400 });
    }

    const venue = await Theater.findById(venueId);
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Default to at least one 'Standard' category if none provided
    const defaultCategories = categories && categories.length > 0 
      ? categories 
      : [{ name: "Standard", priceMultiplier: 1 }];

    // Initialize screens array if it doesn't exist on older Theater documents
    if (!venue.screens) {
      venue.screens = [];
    }

    venue.screens.push({
      name,
      capacity: Number(capacity),
      categories: defaultCategories
    });

    await venue.save();

    return NextResponse.json({ success: true, venue }, { status: 201 });
  } catch (error: any) {
    console.error("Screen Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id: venueId } = await params;
    const url = new URL(req.url);
    const screenId = url.searchParams.get("screenId");

    if (!screenId) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }

    const venue = await Theater.findById(venueId);
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    venue.screens = venue.screens.filter((s: any) => s._id.toString() !== screenId);
    await venue.save();

    return NextResponse.json({ success: true, venue }, { status: 200 });
  } catch (error: any) {
    console.error("Screen Deletion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id: venueId } = await params;
    const url = new URL(req.url);
    const screenId = url.searchParams.get("screenId");

    if (!screenId) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }

    const { layout, categories } = await req.json();
    console.log("RECEIVED LAYOUT:", layout ? `Array of size ${layout.length}` : "No layout");
    console.log("RECEIVED SCREEN ID:", screenId);

    const venue = await Theater.findById(venueId);
    if (!venue) {
      console.log("Venue not found");
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const screenIndex = venue.screens.findIndex((s: any) => s._id.toString() === screenId);
    console.log("Found Screen Index:", screenIndex);
    
    if (screenIndex === -1) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (layout) updateData[`screens.${screenIndex}.layout`] = layout;
    if (categories) updateData[`screens.${screenIndex}.categories`] = categories;

    console.log("Updating data:", Object.keys(updateData));

    if (Object.keys(updateData).length > 0) {
      const db = mongoose.connection.db;
      if (db) {
        const collection = db.collection("theaters");
        const res = await collection.updateOne(
          { _id: new mongoose.Types.ObjectId(venueId) },
          { $set: updateData }
        );
        console.log("Raw Mongo UpdateOne Result:", res);
      } else {
        console.error("No MongoDB db instance found on mongoose connection");
      }
    }
    
    // Fetch updated venue to return
    const updatedVenue = await Theater.findById(venueId);
    const updatedScreen = updatedVenue.screens.find((s: any) => s._id.toString() === screenId);

    return NextResponse.json({ success: true, screen: updatedScreen }, { status: 200 });
  } catch (error: any) {
    console.error("Screen Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
