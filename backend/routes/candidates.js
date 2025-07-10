const express = require("express")
const {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getCandidateStats,
} = require("../controllers/candidateController")
const auth = require("../middleware/auth")
const upload = require("../config/multer")

const router = express.Router()

// All routes are protected
router.use(auth)

// @route   POST /api/candidates
// @desc    Create new candidate
// @access  Private
router.post("/", upload.single("resume"), createCandidate)

// @route   GET /api/candidates
// @desc    Get all candidates
// @access  Private
router.get("/", getCandidates)

// @route   GET /api/candidates/stats
// @desc    Get candidate statistics
// @access  Private
router.get("/stats", getCandidateStats)

// @route   GET /api/candidates/:id
// @desc    Get single candidate
// @access  Private
router.get("/:id", getCandidate)

// @route   PUT /api/candidates/:id/status
// @desc    Update candidate status
// @access  Private
router.put("/:id/status", updateCandidateStatus)

// @route   DELETE /api/candidates/:id
// @desc    Delete candidate
// @access  Private
router.delete("/:id", deleteCandidate)

module.exports = router
