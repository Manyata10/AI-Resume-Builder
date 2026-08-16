// controller for enhancing a resume's professional summary 
//POST : /api/ai/enhance-pro-sum

import Resume from "../models/Resume.js";
import genAI from "../configs/ai.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


export const enhanceProfessionalSummary = async (req, res) => {

    try{
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message : 'Missing required fields'})
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const systemInstruction = `You are an expert in resume writing. Your task is to enhance the professional summary of a resume. CRITICAL: Your response must closely match the exact length of the user's original input. Do not overly expand or give long paragraphs if the user's input is short. Ensure it is highly compelling and ATS-friendly with rich keywords. Provide exactly 3 different robust variations. Return a strictly valid JSON array of 3 strings.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userContent }] }],
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const enhancedContent = JSON.parse(result.response.text());
        return res.status(200).json({enhancedContent})
    
    } catch(error){
        return res.status(400).json({message : error.message})
    }

}



// controller for enhancing a resume's job description 
//POST : /api/ai/enhance-job-desc

export const enhanceJobDescription  = async (req, res) => {

    try{
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message : 'Missing required fields'})
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const systemInstruction = `You are an expert in resume writing. Your task is to enhance the job description of a resume. CRITICAL: Your response must closely match the exact length and structural format of the user's original input. Do not overly expand or give big responses. If the user provided a short sentence, provide a short ATS-friendly sentence. If they provided bullet points, provide bullet points. Use strong action verbs and make it highly ATS-friendly. Provide exactly 3 different variations. Return a strictly valid JSON array of 3 strings.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userContent }] }],
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const enhancedContent = JSON.parse(result.response.text());
        return res.status(200).json({enhancedContent})
    
    } catch(error){
        return res.status(400).json({message : error.message})

    }

}

// controller for enhancing a resume's project description 
//POST : /api/ai/enhance-project-desc

export const enhanceProjectDescription  = async (req, res) => {

    try{
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message : 'Missing required fields'})
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const systemInstruction = `You are an expert in resume writing. Your task is to enhance the project description of a resume. CRITICAL: Your response must closely match the exact length and structural format of the user's original input. Do not overly expand or give big responses. Keep it concise, highlighting key technologies and impact, while making it ATS-friendly. Provide exactly 3 different variations. Return a strictly valid JSON array of 3 strings.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userContent }] }],
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const enhancedContent = JSON.parse(result.response.text());
        return res.status(200).json({enhancedContent})
    
    } catch(error){
        return res.status(400).json({message : error.message})

    }

}



//controller for uploading a resume to the database
//POST: /api/ai/upload-resume

export const uploadResume  = async (req, res) => {

    try{
        
        const {resumeText, tilte} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message : 'Missing required fields'})
        }

        const systemPrompt = "You are an expert AI agent to extract data from resume."

        const userPrompt = `Extract data from the resume : ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after :
        { 
            professional_summary: { type: String, default: '' },
    skills: [{ type: String }],
    personal_info:{
        image: { type: String, default: '' },
        full_name: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
    },
    experience:[
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },

        }
    ],
    project:[
        {
            company: { type: String },
            type: { type: String },
            description: { type: String },
            
        }
    ],
    education:[
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
           
        }
    ],
         }
        
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const extractedData = result.response.text();
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({ userId, title : tilte, ...parsedData})

        res.json({resumeId : newResume._id})
    
    } catch(error){
        return res.status(400).json({message : error.message})
    }

}


// controller for ATS grading evaluation
// POST /api/ai/check-ats

export const checkATS = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Missing PDF Resume File" });
        }

        const { jobDescription, roleLevel } = req.body;
        if (!jobDescription || !roleLevel) {
            return res.status(400).json({ message: "Job Description and Role Level are completely required" });
        }

        // 1. Parse PDF
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: "Could not extract sufficient text from the PDF file." });
        }

        // 2. Query Gemini
        const systemPrompt = `You are a strict, top-tier Enterprise ATS (Applicant Tracking System) parser and evaluator. Your primary job is to grade the extracted resume text against a given Job Description for a specific Role Level. Make your evaluation harshly accurate.
        
You must return your evaluation strictly in the following JSON format ONLY without markdown:
{
  "score": 0,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "strengths": ["strength parameter 1", "strength parameter 2"],
  "weaknesses": ["weakness parameter 1", "weakness parameter 2"],
  "finalVerdict": "string giving a direct summary covering what the applicant should fix."
}`;

        const userPrompt = `
Evaluate the following candidate:

Candidate Level: ${roleLevel}
Job Description/Role Focus: ${jobDescription}

Resume Text:
${resumeText}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        let evaluationRaw = result.response.text();
        evaluationRaw = evaluationRaw.replace(/```json/g, "").replace(/```/g, "").trim();
        const atsResult = JSON.parse(evaluationRaw);

        return res.status(200).json({ success: true, atsResult });

    } catch (error) {
        console.error("ATS Check Error:", error);
        return res.status(500).json({ message: "Failed to grade resume. Please ensure it is a valid text-based PDF." });
    }
}

// controller for generating improved resume tailored to ATS target
// POST /api/ai/improve-resume
export const improveResumeATS = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Missing PDF Resume File" });
        }

        const { jobDescription, roleLevel } = req.body;
        const userId = req.userId;

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        const systemPrompt = "You are an expert AI resume writer and ATS optimizer.";
        const userPrompt = `Take the following resume text and fully rewrite/improve it to perfectly target this Job Description for a ${roleLevel} candidate. Integrate the necessary keywords seamlessly and organically. Ensure the summary is engaging, experiences highlight impact, and skills are updated.

Job Description: ${jobDescription}

Original Resume: ${resumeText}

Provide data in the following JSON format with no additional text:
{ 
    "professional_summary": "string",
    "skills": ["string"],
    "personal_info": {
        "full_name": "string",
        "profession": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string",
        "website": "string"
    },
    "experience": [
        {
            "company": "string",
            "position": "string",
            "start_date": "string",
            "end_date": "string",
            "description": "string",
            "is_current": boolean
        }
    ],
    "project": [
        {
            "company": "string",
            "type": "string",
            "description": "string"
        }
    ],
    "education": [
        {
            "institution": "string",
            "degree": "string",
            "field": "string",
            "graduation_date": "string",
            "gpa": "string"
        }
    ]
}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent({
             contents: [{ role: "user", parts: [{ text: userPrompt }] }],
             systemInstruction: systemPrompt,
             generationConfig: { responseMimeType: "application/json" }
        });
        
        const extractedData = result.response.text();
        const parsedData = JSON.parse(extractedData);
        
        const newResume = await Resume.create({ userId, title: "ATS Optimized Resume", ...parsedData });

        res.json({ success: true, resumeId: newResume._id, resume: newResume });
    } catch(err) {
        return res.status(500).json({ message: "Failed to improve resume: " + err.message });
    }
}
