# Frontend Take-Home Challenge

Hi there!

Welcome to the take-home challenge. I’m excited to showcase my skills and experience through this project. The goal was to create a user interface for a news aggregator website that pulls articles from various sources and displays them in a clean, easy-to-read format.

## What I’ve Done

### Requirements

1. **Article Search and Filtering**:

    - Implemented a feature that allows users to search for articles by keyword.
    - Added filters so users can refine results by date, category, and source.

2. **Personalized News Feed**:

    - Enabled users to customize their news feed by selecting their preferred sources, categories, and authors.

3. **Mobile-Responsive Design**:
    - Ensured the site is optimized for mobile devices, providing a smooth experience on any screen size.

### Data Sources

I chose three APIs to source articles for the site:

1. **NewsAPI**: A comprehensive API providing access to articles from over 70,000 news sources, including major newspapers, magazines, and blogs.

2. **The New York Times**: The New York Times API offers articles from one of the most respected news sources in the world.

3. **NewsAPI.org**: This API provides access to news articles from thousands of sources,
   including news publications, blogs, and magazines.

### Getting Started

To run the project locally, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/lcht1/the-news.git

    ```

2. **Run the Docker container**:

````bash
   docker build -t the-news .
   docker run --env-file .env -p 5173:5173 the-news
   ```
````

### Environment Variables

For your convenience, I have included the `.env` file with the necessary API keys and URLs required for the project. This will allow you to run the application immediately without the need to create or configure your own API keys. The `.env` file should be placed in the root directory and is already configured to work with the project.

### Note

Please note that the `.env` file contains sensitive information and should be handled with care. It's included in this repository to simplify the review process and ensure that you can test the application without any additional setup.
