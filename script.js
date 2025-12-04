// Survey Application v07
// Client-side JavaScript for handling survey submissions

class SurveyApp {
    constructor() {
        this.submissions = this.loadSubmissions();
        this.init();
    }

    init() {
        // Get DOM elements
        this.surveyForm = document.getElementById('surveyForm');
        this.thankYouSection = document.getElementById('thankYou');
        this.mainSurvey = document.getElementById('mainSurvey');
        this.newSurveyBtn = document.getElementById('newSurvey');
        this.resultsDiv = document.getElementById('results');

        // Event listeners
        this.mainSurvey.addEventListener('submit', (e) => this.handleSubmit(e));
        this.newSurveyBtn.addEventListener('click', () => this.resetForm());

        // Display existing results
        this.displayResults();
    }

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.mainSurvey);
        const submission = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            name: formData.get('name'),
            email: formData.get('email'),
            satisfaction: formData.get('satisfaction'),
            comments: formData.get('comments'),
            recommend: formData.get('recommend')
        };

        // Save submission
        this.submissions.push(submission);
        this.saveSubmissions();

        // Show thank you message
        this.surveyForm.classList.add('hidden');
        this.thankYouSection.classList.remove('hidden');

        // Update results
        this.displayResults();

        // Clear form
        this.mainSurvey.reset();
    }

    resetForm() {
        this.surveyForm.classList.remove('hidden');
        this.thankYouSection.classList.add('hidden');
    }

    saveSubmissions() {
        localStorage.setItem('surveySubmissions', JSON.stringify(this.submissions));
    }

    loadSubmissions() {
        const stored = localStorage.getItem('surveySubmissions');
        return stored ? JSON.parse(stored) : [];
    }

    displayResults() {
        if (this.submissions.length === 0) {
            this.resultsDiv.innerHTML = '<p>No submissions yet.</p>';
            return;
        }

        const satisfactionLabels = {
            '5': 'Very Satisfied',
            '4': 'Satisfied',
            '3': 'Neutral',
            '2': 'Dissatisfied',
            '1': 'Very Dissatisfied'
        };

        // Calculate statistics
        const totalSubmissions = this.submissions.length;
        const avgSatisfaction = this.submissions.reduce((sum, s) => sum + parseInt(s.satisfaction), 0) / totalSubmissions;
        const recommendYes = this.submissions.filter(s => s.recommend === 'yes').length;
        const recommendPercent = ((recommendYes / totalSubmissions) * 100).toFixed(1);

        let html = `
            <div class="result-item">
                <h3>Summary Statistics</h3>
                <p><strong>Total Submissions:</strong> ${totalSubmissions}</p>
                <p><strong>Average Satisfaction:</strong> ${avgSatisfaction.toFixed(2)} / 5.00</p>
                <p><strong>Would Recommend:</strong> ${recommendPercent}% (${recommendYes} out of ${totalSubmissions})</p>
            </div>
        `;

        // Show latest 5 submissions
        const recentSubmissions = this.submissions.slice(-5).reverse();
        
        html += '<h3 style="margin-top: 20px; color: #667eea;">Recent Submissions:</h3>';
        
        recentSubmissions.forEach(submission => {
            const date = new Date(submission.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            html += `
                <div class="result-item">
                    <h3>${submission.name}</h3>
                    <p><strong>Email:</strong> ${submission.email}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Satisfaction:</strong> ${satisfactionLabels[submission.satisfaction]}</p>
                    <p><strong>Would Recommend:</strong> ${submission.recommend.charAt(0).toUpperCase() + submission.recommend.slice(1)}</p>
                    ${submission.comments ? `<p><strong>Comments:</strong> ${submission.comments}</p>` : ''}
                </div>
            `;
        });

        this.resultsDiv.innerHTML = html;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SurveyApp();
});
