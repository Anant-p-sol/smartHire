import Job from '../models/Job.js';

// ✅ CREATE JOB — Recruiter only
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      skills,
      jobType,
      experience,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skills,
      jobType,
      experience,
      deadline,
      recruiter: req.user.id, 
    });

    res.status(201).json({
      message: '✅ Job posted successfully',
      job,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL JOBS — for Everyone 
export const getAllJobs = async (req, res) => {
  try {
    // Search & Filter query params 
    const { search, location, jobType, experience } = req.query;

    let filter = { isActive: true };

    // Search by title & skills
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (experience) filter.experience = experience;

    const jobs = await Job.find(filter)
      .populate('recruiter', 'name company email') // recruiter details
      .sort({ createdAt: -1 }); // latest 

    res.status(200).json({
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SINGLE JOB
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name company email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE JOB — 
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Owner check 
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // updated document return 
    );

    res.status(200).json({
      message: '✅ Job updated successfully',
      job: updatedJob,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE JOB — Sirf us job ka recruiter
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Owner check 
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: '✅ Job deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET MY JOBS — Recruiter ke apne jobs
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};