// ===============================================
// BLOG PAGE - FILTER AND MODAL
// ===============================================

// Blog post filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter blog cards
        blogCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                // Re-trigger AOS animation
                card.classList.add('aos-animate');
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Blog modal content
const blogPosts = {
    1: {
        title: 'The Future of AI in 2025: What to Expect',
        date: 'November 5, 2025',
        category: 'AI News',
        content: `
            <p>Artificial Intelligence is evolving at an unprecedented pace. As we look ahead to 2025, several groundbreaking trends are emerging that will reshape how we interact with technology.</p>
            
            <h3>1. Generative AI Goes Mainstream</h3>
            <p>Generative AI tools are becoming increasingly sophisticated, moving beyond text and images to create music, videos, and even entire software applications. We're seeing a democratization of creative tools that were once the domain of experts.</p>
            
            <h3>2. AI in Healthcare</h3>
            <p>Machine learning models are revolutionizing diagnosis, drug discovery, and personalized medicine. AI-powered tools are helping doctors detect diseases earlier and develop targeted treatments.</p>
            
            <h3>3. Ethical AI Takes Center Stage</h3>
            <p>As AI becomes more powerful, questions about bias, privacy, and accountability are more important than ever. Companies are investing heavily in responsible AI development.</p>
            
            <h3>4. Edge AI and IoT</h3>
            <p>AI is moving from the cloud to the edge, enabling real-time processing on devices. This shift is crucial for autonomous vehicles, smart cities, and industrial automation.</p>
            
            <h3>Conclusion</h3>
            <p>The future of AI is bright, but it comes with responsibilities. At Shree AI, we're committed to building tools that are not only powerful but also ethical and accessible to everyone.</p>
        `
    },
    2: {
        title: '10 JavaScript Tricks Every Developer Should Know',
        date: 'November 3, 2025',
        category: 'Coding Tips',
        content: `
            <p>Level up your JavaScript skills with these powerful tricks and techniques that will make your code cleaner, more efficient, and easier to maintain.</p>
            
            <h3>1. Destructuring Assignment</h3>
            <pre><code>const { name, age } = user;
const [first, second] = array;</code></pre>
            
            <h3>2. Spread Operator</h3>
            <pre><code>const combined = [...array1, ...array2];
const clone = { ...original };</code></pre>
            
            <h3>3. Optional Chaining</h3>
            <pre><code>const value = obj?.property?.nested;</code></pre>
            
            <h3>4. Nullish Coalescing</h3>
            <pre><code>const result = value ?? defaultValue;</code></pre>
            
            <h3>5. Array Methods</h3>
            <pre><code>const filtered = array.filter(item => item.active);
const mapped = array.map(item => item.name);</code></pre>
            
            <p>Master these techniques and watch your productivity soar!</p>
        `
    },
    3: {
        title: 'Building Shree AI: Our Journey from Idea to Beta',
        date: 'October 30, 2025',
        category: 'Startup Life',
        content: `
            <p>A few months ago, Shree AI was just an idea in the minds of four 19-year-old developers from Kutch, Gujarat. Today, we're in beta with our first users. Here's our story.</p>
            
            <h3>The Beginning</h3>
            <p>We started in a small room with four laptops and a dream: to make AI accessible to everyone. People told us we needed to move to Bangalore or Mumbai. We decided to prove them wrong.</p>
            
            <h3>The Challenges</h3>
            <p>Building a startup from a small town came with unique challenges: limited resources, skepticism from investors, and infrastructure issues. But these challenges made us stronger and more determined.</p>
            
            <h3>Our First Users</h3>
            <p>We launched our beta program last month and were overwhelmed by the response. Our first 50 users gave us invaluable feedback that's shaping our products every day.</p>
            
            <h3>What's Next</h3>
            <p>We're still in early stages, currently refining our products based on beta feedback. Our mission is to democratize AI, and we're just getting started. Want to join our journey? Sign up for beta access!</p>
        `
    }
};

// Modal functionality
function openBlogModal(postId) {
    const modal = document.getElementById('blogModal');
    const modalBody = document.getElementById('blogModalBody');
    const post = blogPosts[postId];
    
    if (post) {
        modalBody.innerHTML = `
            <span class="blog-category" style="background-color: var(--color-primary); color: white; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.875rem; display: inline-block; margin-bottom: 1rem;">
                ${post.category}
            </span>
            <h2 style="margin-bottom: 1rem;">${post.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">
                <i class="fas fa-calendar"></i> ${post.date}
            </p>
            ${post.content}
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
const blogModal = document.getElementById('blogModal');
if (blogModal) {
    document.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            closeBlogModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBlogModal();
        }
    });
}

// Newsletter form
const blogNewsletterForm = document.getElementById('blogNewsletterForm');
if (blogNewsletterForm) {
    blogNewsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = blogNewsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing! We'll send blog updates to ${email}`);
        blogNewsletterForm.reset();
    });
}
