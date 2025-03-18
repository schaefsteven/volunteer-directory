import { CollectionConfig } from "payload";

export const Listings: CollectionConfig = {
  slug: "listings",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "organization", "isRemote", "updatedAt"],
    group: "Content",
  },
  access: {
    // Allow anyone to read
    read: () => true,

    // For create, update, and delete, just check if user is authenticated
    create: ({ req }) => {
      // Just check if the user exists (is logged in)
      return Boolean(req.user);
    },
    update: ({ req }) => {
      return Boolean(req.user);
    },
    delete: ({ req }) => {
      return Boolean(req.user);
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Opportunity Title",
    },
    {
        type: "row",
        fields: [
            {
                name: "location type",
                required: true,
                type: "select",
                options: [
                    "Remote",
                    "In-person",
                    "Hybrid",
                    "Lifestyle",
                ],
            },
            {
                name: "zip code",
                type: "number"
            },
        ],
    },
    {
        type: "row",
        fields: [
            {
                name: "min hours",
                label: "Minimum hours per week",
                type: "number",
                min: "0",
                max: "168",
            },
            {
                name: "max hours",
                label: "Maximum hours per week",
                type: "number",
                min: "0",
                max: "168",
            },
        ],
    },
    {
        name: "description",
        type: "richText",
    },
    {
        name: "first step",
        type: "richText",
    },
    {
        name: "tags",
        type: "select",
        hasMany: true,
        options: [
            "environment",
            "homelessness",
            "food security",
            "LGBTQ",
            "consumer action",
        ],
    },
    // Rest of your fields
  ],
  timestamps: true,
};
