import mongoose from "mongoose";
const categoryForAcademicResourceSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
// this part creates the model from our schema
const CategoryForAcademicResource = mongoose.model( "CategoryForAcademicResource", categoryForAcademicResourceSchema);
// Export the model
export default CategoryForAcademicResource;