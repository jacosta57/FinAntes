import React from 'react'

function Profile() {
  return (
    <div id="profile-section" className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4 settings-content">
                    <h3 className="mb-4 text-primary">Profile Settings</h3>

                    <div className="card mb-4">
                        <div className="card-header">Personal Information</div>
                        <div className="card-body">
                            <form id="profileForm">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="firstName" placeholder="Enter your first name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" placeholder="Enter your last name" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input type="tel" className="form-control" id="phone" placeholder="Enter your phone number" />
                                </div>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">Change Password</div>
                        <div className="card-body">
                            <form id="passwordForm">
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                    <input type="password" className="form-control" id="currentPassword" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input type="password" className="form-control" id="newPassword" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" id="confirmPassword" />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Password</button>
                            </form>
                        </div>
                    </div>




                </div>
  )
}

export default Profile