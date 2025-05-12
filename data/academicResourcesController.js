import AcademicResource from "../models/academicResources.model.js";
import { getUserById } from "./userController.js";
import {
  isValidID,
  isValidString,
  isValidArray,
} from "../utils/validation.utils.js";
import Tags from "../models/tags.model.js";
import AcademicResourceVotes from "../models/academicResourceVotes.model.js";
import Reports from "../models/reports.model.js";

export const createAcademicResource = async (
  userId,
  title,
  description,
  url,
  tags
) => {
  if (!userId || !title || !description || !url) {
    throw new Error("userId, title, description, and url are required.");
  }

  title = isValidString(title, "Resource Title");
  description = isValidString(description, "Resource Description");
  userId = isValidID(userId, "userId");
  url = isValidString(url, "URL");

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("No User Found With Given ID");
  }

  if (tags && tags.length !== 0) {
    tags = await isValidArray(tags, "Tags");
    tags = tags.map((tag) => isValidID(tag, "TagID"));
  }

  const newAcademicResource = new AcademicResource({
    title,
    description,
    url,
    uploadedBy: userId,
    tags: tags || [],
  });

  try {
    const savedAcademicResource = await newAcademicResource.save();
    if (!savedAcademicResource || !savedAcademicResource._id) {
      throw new Error("Could not create a new Academic Resource");
    }
    return savedAcademicResource;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllAcademicResources = async () => {
  try {
    const allAcademicResources = await AcademicResource.find()
      .populate("uploadedBy", "firstName lastName")
      .populate("tags", "name")
      .select("-reportedBy")
      .lean();
    if (!allAcademicResources) {
      throw new Error(
        "Sorry, no Academic Resources available right now to be displayed"
      );
    }
    return allAcademicResources;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAcademicResourceById = async (id) => {
  id = isValidID(id, "Academic Resource ID");
  const academicResource = await AcademicResource.findById(id);
  if (!academicResource) {
    throw new Error("Academic Resource not found");
  }
  return academicResource;
};

export const updateAcademicResourceByID = async (
  academicResourceId,
  updatedAcademicResource
) => {
  try {
    academicResourceId = isValidID(academicResourceId);
    const existingResource = await AcademicResource.findById(
      academicResourceId
    );
    if (!existingResource) {
      throw new Error("Could not find the academic resource with the given ID");
    }

    if (updatedAcademicResource.title) {
      existingResource.title = isValidString(
        updatedAcademicResource.title,
        "Academic Resource Title"
      );
    }

    if (updatedAcademicResource.description) {
      existingResource.description = isValidString(
        updatedAcademicResource.description,
        "Academic Resource Description"
      );
    }

    if (updatedAcademicResource.url) {
      existingResource.url = isValidString(
        updatedAcademicResource.url,
        "Academic Resource URL"
      );
    }

    if (
      updatedAcademicResource.tags &&
      updatedAcademicResource.tags.length !== 0
    ) {
      updatedAcademicResource.tags = await isValidArray(
        updatedAcademicResource.tags,
        "Tags"
      );
      existingResource.tags = updatedAcademicResource.tags.map((tag) =>
        isValidID(tag, "TagID")
      );
    }
    const newAcademicResource = await existingResource.save();
    return newAcademicResource;
  } catch (error) {
    throw new Error("Error Updating the Academic Resource:" + error.message);
  }
};

export const deleteAcacdemicResourceById = async (id) => {
  try {
    const validId = isValidID(id, "Forum Post ID");

    const deletedAcademicResource = await AcademicResource.findByIdAndDelete(
      validId
    );

    if (!deletedAcademicResource) {
      throw new Error("Academic Resource post not found");
    }

    await Reports.updateMany(
      { academicResourceId: validId },
      { $set: { status: "resolved" } }
    );
    const academicResourceVotes = await AcademicResourceVotes.find({
      academicResourceId: id,
    });

    if (academicResourceVotes) {
      const deleteAcacdemicResourceVotes =
        await AcademicResourceVotes.deleteMany({ academicResourceId: id });

      if (!deleteAcacdemicResourceVotes) {
        throw new Error("Could not delete votes!");
      }
    }

    return {
      message: "Academic Resource deleted successfully",
      deletedAcademicResource,
    };
  } catch (error) {
    throw new Error(`Error deleting Academic Resource: ${error.message}`);
  }
};

export const filterAcademicResources = async (keyword) => {
  try {
    keyword = isValidString(keyword, "keyword");
    const academicResource = await AcademicResource.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    if (!academicResource || academicResource.length === 0) {
      throw new Error("No Academic Resources found matching the keyword.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAcademicResourceByUserId = async (userId) => {
  let academicResource;
  userId = isValidID(userId, "UserID");
  try {
    academicResource = await AcademicResource.find({ userId: userId });
  } catch (error) {
    throw new Error("Failed to fetch Academic Resources: " + error.message);
  }
  if (!academicResource || academicResource.length === 0) {
    throw new Error("Sorry, you haven't created any Academic Resources yet!!");
  }
  return academicResource;
};

export const getAcademicResourceByTagId = async (tagId) => {
  let academicResource;
  tagId = isValidID(tagId, "tagID");
  try {
    academicResource = await AcademicResource.find({ tags: tagId });
  } catch (error) {
    throw new Error("Failed to fetch Academic Resources: " + error.message);
  }
  if (!academicResource || academicResource.length === 0) {
    throw new Error(`No Academic Resources found with tag: ${tagId}`);
  }
  return academicResource;
};

export const getAcademicResourceByStatus = async (status) => {
  let academicResource;
  status = isValidString(status, "Status");
  try {
    academicResource = await AcademicResource.find({ status: status });
  } catch (error) {
    throw new Error("Failed to fetch Academic Resources: " + error.message);
  }
  if (!academicResource || academicResource.length === 0) {
    throw new Error(`No Academic Resources found with status: ${status}`);
  }
  return academicResource;
};

export const upvoteAcademicResource = async (academicResourceId, userId) => {
  academicResourceId = isValidID(academicResourceId, "AcademicResourceID");
  userId = isValidID(userId, "UserID");

  let existingVote = await AcademicResourceVotes.findOne({
    academicResourceId: academicResourceId,
    voterId: userId,
  });

  if (!existingVote) {
    let academicResource = await AcademicResource.findByIdAndUpdate(
      academicResourceId,
      { $inc: { upVotes: 1 } },
      { new: true }
    );

    if (!academicResource) {
      throw new Error("Academic Resource not found.");
    }

    const newVote = new AcademicResourceVotes({
      voterId: userId,
      academicResourceId: academicResourceId,
      voteType: "UP",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    return academicResource;
  }

  if (existingVote && existingVote.voteType === "UP") {
    throw new Error("You can't vote for an academic resource more than once !");
  }

  if (existingVote && existingVote.voteType === "DOWN") {
    let academicResource = await AcademicResource.findByIdAndUpdate(
      academicResourceId,
      { $inc: { upVotes: 1, downVotes: -1 } },
      { new: true }
    );
    if (!academicResource) {
      throw new Error("Academic Resource not found.");
    }

    let updatedVote = await AcademicResourceVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "UP" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return academicResource;
  }
};

export const downvoteAcademicResource = async (academicResourceId, userId) => {
  academicResourceId = isValidID(academicResourceId, "AcademicResourceID");
  userId = isValidID(userId, "UserID");

  let existingVote = await AcademicResourceVotes.findOne({
    academicResourceId: academicResourceId,
    voterId: userId,
  });

  if (!existingVote) {
    let academicResource = await AcademicResource.findByIdAndUpdate(
      academicResourceId,
      { $inc: { downVotes: 1 } },
      { new: true }
    );

    if (!academicResource) {
      throw new Error("Academic Resource not found.");
    }

    const newVote = new AcademicResourceVotes({
      voterId: userId,
      academicResourceId: academicResourceId,
      voteType: "DOWN",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    return academicResource;
  }

  if (existingVote && existingVote.voteType === "DOWN") {
    throw new Error("You can't vote for an academic resource more than once !");
  }

  if (existingVote && existingVote.voteType === "UP") {
    let academicResource = await AcademicResource.findByIdAndUpdate(
      academicResourceId,
      { $inc: { upVotes: -1, downVotes: 1 } },
      { new: true }
    );

    if (!academicResource) {
      throw new Error("Academic Resource not found.");
    }

    let updatedVote = await AcademicResourceVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "DOWN" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return academicResource;
  }
};

export const reportAcademicResource = async (academicResourceId, userId) => {
  academicResourceId = isValidID(academicResourceId, "AcademicResourceID");
  userId = isValidID(userId, "UserID");

  try {
    let academicResource = AcademicResource.findByIdAndUpdate(
      academicResourceId,
      { $set: { status: "reported" }, $push: { reportedBy: userId } }
    );

    if (!academicResource) {
      throw new Error("Academic Resource not found");
    }
    return academicResource;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const unreportAcademicResource = async (academicResourceId, userId) => {
  academicResourceId = isValidID(academicResourceId, "AcademicResourceID");
  userId = isValidID(userId, "UserID");
  try {
    let academicResource = AcademicResource.findByIdAndUpdate(
      academicResourceId,
      { $set: { reportedBy: null, status: "active" } }
    );
    if (!academicResource) {
      throw new Error("Academic Resource not found");
    }
    return academicResource;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReportedAcademicResources = async () => {
  try {
    const reportedResources = await AcademicResource.find({
      reportedBy: { $exists: true, $not: { $size: 0 } },
    });
    if (!reportedResources || reportedResources.length === 0) {
      throw new Error("No Academic Resources were Reported");
    }
    return reportedResources;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const changeAcademicResourceStatus = async (
  academicResourceId,
  status
) => {};

export const reportResource = async (resourceId, userId) => {
  resourceId = isValidID(resourceId, "ResourceID");
  userId = isValidID(userId, "UserID");

  try {
    let reportCount = await Reports.countDocuments({
      academicResourceId: resourceId,
    });
    console.log("Report Count: ", reportCount);

    if (reportCount > 5) {
      let resource = await AcademicResource.findByIdAndUpdate(
        resourceId,
        {
          $set: { status: "hidden" },
          $push: { reportedBy: userId },
        },
        { new: true }
      );
    } else {
      let resource = await AcademicResource.findByIdAndUpdate(resourceId, {
        $push: { reportedBy: userId },
      });
    }

    let resource = await AcademicResource.findById(resourceId);
    if (!resource) {
      throw new Error("Resource not found");
    }

    return resource;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchAcademicResourceFilterSort = async (
  text = "",
  sort = "createdAt",
  order = "desc"
) => {
  const sortOption = { [sort]: order === "asc" ? 1 : -1 };
  const trimmed = text.trim();
  const regex = trimmed ? new RegExp(trimmed, "i") : null;

  const AcademicResourceFilter = {};

  let tagIds = [];
  if (regex) {
    const matchingTags = await Tags.find({ name: regex }).select("_id").lean();
    tagIds = matchingTags.map((t) => t._id);

    AcademicResourceFilter.$or = [
      { title: regex },
      { description: regex },
      ...(tagIds.length ? [{ tags: { $in: tagIds } }] : []),
    ];
  }

  let AcademicResources = [];

  AcademicResources = await AcademicResource.find(AcademicResourceFilter)
    .sort(sortOption)
    .populate("uploadedBy tags", "firstName lastName name -_id")
    .lean();

  return AcademicResources;
};
