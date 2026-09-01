import { Schema, model, models } from "mongoose";

const DomainHealthSchema = new Schema(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    spfStatus: {
      type: String,
      enum: ["verified", "failed"],
      default: "failed",
    },
    dkimStatus: {
      type: String,
      enum: ["verified", "failed"],
      default: "failed",
    },
    dmarcStatus: {
      type: String,
      enum: ["verified", "failed"],
      default: "failed",
    },
    reputation: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    spamComplaints: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCheckedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const DomainHealthModel = models.DomainHealth || model("DomainHealth", DomainHealthSchema);

export default DomainHealthModel;
