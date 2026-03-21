import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Experience <span>&</span>
          <br /> activities
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web Development Intern Trainee</h4>
                <h5>CSism Technologies, Virar</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Supported development of responsive websites using HTML, CSS,
              JavaScript, and PHP. Implemented backend connectivity with MySQL,
              handled debugging/testing, and contributed to deployment and
              performance optimization.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Coordinator</h4>
                <h5>PRESENTANIA</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Managed event planning, team coordination, and participant
              communication for PRESENTANIA 2025 and 2026.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Member</h4>
                <h5>NSS (National Service Scheme)</h5>
              </div>
              <h3>ONGOING</h3>
            </div>
            <p>
              Participated in social initiatives including Beach Cleaning Drive
              and Drugs & Alcohol Awareness Campaign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
