const Candidate = require("../models/Candidate")
const { validateEmail, validatePhone, sanitizeInput } = require("../utils/validators")
const fs = require("fs")
const path = require("path")

// Create new candidate
const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobTitle, notes } = req.body

    // Validation
    if (!name || !email || !phone || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      })
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      })
    }

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email })
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: "Candidate with this email already exists",
      })
    }

    // Create candidate data
    const candidateData = {
      name: sanitizeInput(name),
      email: email.toLowerCase(),
      phone: sanitizeInput(phone),
      jobTitle: sanitizeInput(jobTitle),
      referredBy: req.user._id,
      notes: notes ? sanitizeInput(notes) : undefined,
    }

    // Add resume URL if file was uploaded
    if (req.file) {
      candidateData.resumeUrl = `/uploads/resumes/${req.file.filename}`
    }

    const candidate = new Candidate(candidateData)
    await candidate.save()

    // Populate referredBy field for response
    await candidate.populate("referredBy", "name email")

    res.status(201).json({
      success: true,
      message: "Candidate referred successfully",
      candidate,
    })
  } catch (error) {
    console.error("Create candidate error:", error)

    // Delete uploaded file if candidate creation failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err)
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating candidate",
    })
  }
}

// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query

    // Build query
    const query = {}

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    // Filter by status
    if (status && status !== "all") {
      query.status = status
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get candidates with pagination
    const candidates = await Candidate.find(query)
      .populate("referredBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const total = await Candidate.countDocuments(query)

    res.json({
      success: true,
      candidates,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / Number.parseInt(limit)),
        total,
      },
    })
  } catch (error) {
    console.error("Get candidates error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching candidates",
    })
  }
}

// Get single candidate
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate("referredBy", "name email")

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      })
    }

    res.json({
      success: true,
      candidate,
    })
  } catch (error) {
    console.error("Get candidate error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching candidate",
    })
  }
}

// Update candidate status
const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params

    // Validate status
    const validStatuses = ["Pending", "Reviewed", "Hired", "Rejected"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      })
    }

    const candidate = await Candidate.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate(
      "referredBy",
      "name email",
    )

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      })
    }

    res.json({
      success: true,
      message: "Candidate status updated successfully",
      candidate,
    })
  } catch (error) {
    console.error("Update candidate status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating candidate status",
    })
  }
}

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      })
    }

    // Delete resume file if exists
    if (candidate.resumeUrl) {
      const filePath = path.join(__dirname, "..", candidate.resumeUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting resume file:", err)
      })
    }

    await Candidate.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Candidate deleted successfully",
    })
  } catch (error) {
    console.error("Delete candidate error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting candidate",
    })
  }
}

// Get candidate statistics
const getCandidateStats = async (req, res) => {
  try {
    const stats = await Candidate.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const total = await Candidate.countDocuments()

    res.json({
      success: true,
      stats: {
        total,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count
          return acc
        }, {}),
      },
    })
  } catch (error) {
    console.error("Get candidate stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
    })
  }
}

module.exports = {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getCandidateStats,
}
