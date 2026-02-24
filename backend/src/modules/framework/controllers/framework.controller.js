import { Framework } from "../models/framework.model.js";
import { generateFrameworkWithAI } from "../services/framework-ai.service.js";

export const generateFramework = async (req, res) => {
  const config = req.body;

  const generated = await generateFrameworkWithAI(config);

  const framework = await Framework.create({
    ...config,
    prompt: generated.prompt,
    folderStructure: generated.folderStructure,
    files: generated.files,
    rawResponse: generated.rawResponse
  });

  res.status(200).json({
    success: true,
    data: {
      id: framework._id,
      folderStructure: framework.folderStructure,
      files: framework.files
    }
  });
};
