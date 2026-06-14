import Application from '../models/Application.js';
import Job from '../models/Job.js';

// ✅ APPLY FOR JOB — Candidate only
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // 1. Job exist करती है?
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // 2. Job active है?
    if (!job.isActive) {
      return res.status(400).json({ message: 'Job is no longer active' });
    }

    // 3. Already apply किया है?
    const alreadyApplied = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // 4. Application बनाओ
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      coverLetter,
    });

    res.status(201).json({
      message: '✅ Applied successfully',
      application,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET MY APPLICATIONS — Candidate ke apne applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    })
      .populate('job', 'title company location salary jobType') // job details
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET JOB APPLICANTS — Recruiter ke liye
export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Job recruiter का है?
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicants = await Application.find({ job: jobId })
      .populate('candidate', 'name email skills experience resume') // candidate details
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: applicants.length,
      applicants,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE APPLICATION STATUS — Recruiter only
export const updateStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Valid status?
    const validStatus = ['applied', 'shortlisted', 'rejected', 'hired'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Recruiter authorized है?
    if (application.job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: `✅ Status updated to ${status}`,
      application,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE APPLICATION — Candidate apni application withdraw kare
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Sirf apni application delete kar sakte ho
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({ message: '✅ Application withdrawn successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};