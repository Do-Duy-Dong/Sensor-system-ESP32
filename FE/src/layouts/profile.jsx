import "../assets/profile.scss"
import NavBar from "../components/navbar";
import anh from "../public/WIN_20250813_16_10_10_Pro.jpg"
import doc from "../public/Sequence.pdf"
const Profile=  ()=> {
    return (
        <div>
        <NavBar />
        <div class="profile-main-content">
        
        <div class="profile-container">
            <div class="profile-profile-card">
                <div class="profile-avatars">
                    <img class="profile-logo"src={anh}></img>
                </div>
                
                <h1 class="profile-name">Đỗ Duy Đông</h1>
                <p class="profile-title">Sinh viên PTIT</p>
                
                <div class="profile-info-grid">
                    <div class="profile-info-item">
                        <svg class="profile-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 114 0v2"/>
                        </svg>
                        <span class="profile-info-label">MSV:</span>
                        <span class="profile-info-value">B22DCCN215</span>
                    </div>
                    
                    <div class="profile-info-item">
                        <svg class="profile-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <span class="profile-info-label">Email:</span>
                        <span class="profile-info-value">
                            <a href="mailto:DongDD.B22CN215@stu.ptit.edu.vn">DongDD.B22CN215@stu.ptit.edu.vn</a>
                        </span>
                    </div>
                    
                    <div class="profile-info-item">
                        <svg class="profile-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <span class="profile-info-label">Phone:</span>
                        <span class="profile-info-value">0964850281</span>
                    </div>
                    
                    <div class="profile-info-item">
                        <svg class="profile-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m-4 4l4 4-4 4"/>
                        </svg>
                        <span class="profile-info-label">GitHub:</span>
                        <span class="profile-info-value">
                            <a href="https://github.com/DuyDong-68" target="_blank">github.com/DuyDong-68</a>
                        </span>
                    </div>
                </div>
                
                <div class="profile-action-buttons">
                    <a href="https://documenter.getpostman.com/view/39871363/2sB3QKrq4b" class="profile-btn profile-btn-primary" target="_blank" >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Tải PDF    
                    </a>
                    <a href="https://documenter.getpostman.com/view/39871363/2sB3QKrq4b" class="profile-btn profile-btn-primary" target="_blank" >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        API Doc   
                    </a>
                </div>
            </div>
        </div>
        </div>

        </div>
    );
}
export default Profile;