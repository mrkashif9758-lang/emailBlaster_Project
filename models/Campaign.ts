// models/Campaign.ts

import { Schema, models, model } from "mongoose";

const CampaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    senderEmail: {
      type: String,
      required: true,
    },

    targetSegment: {
      type: String,
      default: "all",
    },

    content: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "sending", "sent"],
      default: "draft",
    },

    totalRecipients: {
      type: Number,
      default: 0,
    },

    sentCount: {
      type: Number,
      default: 0,
    },

    openCount: {
      type: Number,
      default: 0,
    },

    deliveredCount: {
      type: Number,
      default: 0,
    },

    clickCount: {
      type: Number,
      default: 0,
    },

    hardBounceCount: {
      type: Number,
      default: 0,
    },

    softBounceCount: {
      type: Number,
      default: 0,
    },

    spamComplaintCount: {
      type: Number,
      default: 0,
    },

    unsubscribeCount: {
      type: Number,
      default: 0,
    },

    openHistory: [
      {
        date: Date,
        count: { type: Number, default: 1 },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    sentAt: {
      type: Date,
      default: null,
    },

    bounceCount: {
      type: Number,
      default: 0,
    },

    processedBounceIds: {
  type: [String],
  default: [],
},

    failedEmails: [
      {
        email: String,
        reason: String,
        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CampaignModel = models.Campaign || model("Campaign", CampaignSchema);

if (!CampaignModel.schema.path("isDeleted")) {
  CampaignModel.schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });
}

export default CampaignModel;