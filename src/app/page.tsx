'use client';
import {
  Container,
  Grid2,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Link,
} from '@mui/material';
import { useEffect } from 'react';

export default function Home() {
  // Set up effect to offset the y position when a navigation anchor is clicked
  // so the content isn't hidden behind the AppBar.
  useEffect(() => {
    const handleAnchorScroll = (e: MouseEvent) => {
      if (e.target instanceof HTMLAnchorElement && e.target.hash) {
        const targetElement = document.querySelector(e.target.hash);

        if (targetElement) {
          const appBarHeight = 64;
          const offset =
            window.scrollY +
            targetElement.getBoundingClientRect().top -
            appBarHeight;

          window.scrollTo({
            top: offset,
            behavior: 'smooth',
          });

          e.preventDefault();
        }
      }
    };

    window.addEventListener('click', handleAnchorScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('click', handleAnchorScroll);
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <header>
        <Box mb={4}>
          <Typography variant="h3" gutterBottom>
            Welcome to Military Logistics Management System
          </Typography>
          <Typography component="p" variant="body1">
            This portfolio project is to demonstrate my ability to create a
            professional full-stack application with integrated AI-tools.
          </Typography>
        </Box>
        <Box mb={4}>
          <Typography variant="h5">Navigation</Typography>
          <List>
            <ListItem>
              <ListItemText>
                <Link href="#about" color="inherit">
                  About
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#goals" color="inherit">
                  Project Goals
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#highlights" color="inherit">
                  Technical Highlights
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#front" color="inherit">
                  Frontend Tech Stack
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#back" color="inherit">
                  Backend Tech Stack
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#other" color="inherit">
                  Other Tech Stack
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#docs" color="inherit">
                  Documentation and Resources
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href="#contact" color="inherit">
                  Contact Me
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </header>

      <section>
        <Typography variant="h4" gutterBottom id="about">
          About the Project
        </Typography>
        <Typography component="p" variant="body1">
          Why military logistics? Well, two reasons. One, military logistics has
          unique challenges in scope and seriousness. Two, I have always been
          fascinated with the military and have the utmost respect for the men
          and women who choose to serve and sacrifice for the nation.
        </Typography>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="goals">
          Project Goals
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Simulate real-world application"
              secondary="This project mirrors the complexity of enterprise-level systems,
            ensuring scalability, security, and usability."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Incorporate AI tools to help solve logistic problems"
              secondary="AI predictions optimize resource allocation, reducing supply chain inefficiencies."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Increase efficiency and effectiveness on supply lines"
              secondary="The system aims to minimize delays and ensure timely delivery of critical supplies."
            />
          </ListItem>
        </List>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="highlights">
          Technical Highlights
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="CRUD interactions (Admin, Users, Inventory)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Authentication using JWT and role-based authorization" />
          </ListItem>
          <ListItem>
            <ListItemText primary="IBM Cloud deployment" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Implemented unit, integration, and E2E tests using Jest and Playwright to ensure reliability." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Utilized CI/CD pipelines for continuous integration and deployment." />
          </ListItem>
        </List>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="front">
          Frontend Tech Stack
        </Typography>

        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Core Framework</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Next.js 15: Provides server-side rendering and dynamic routing." />
              </ListItem>
              <ListItem>
                <ListItemText primary="React 19: A powerful library for building interactive UIs." />
              </ListItem>
              <ListItem>
                <ListItemText primary="TypeScript: Ensures type safety and enhances development productivity." />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">UI and Styling</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Tailwind CSS: A utility-first CSS framework for custom designs." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Material-UI (MUI): Pre-built components for rapid UI development." />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">State Management</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Redux Toolkit: Simplifies and optimizes state management workflows." />
              </ListItem>
              <ListItem>
                <ListItemText primary="React-Redux: Connects Redux state to React components." />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Data Fetching</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Axios: A versatile HTTP client for REST API integration." />
              </ListItem>
              <ListItem>
                <ListItemText primary="SWR: A React hook library for data fetching and caching." />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Testing and Quality Assurance</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Jest: A testing framework for unit tests." />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Testing Library: Focuses on testing UI
              interactions."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Playwright: End-to-end testing to simulate user
              workflows."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Mock Service Worker (MSW): Mocks API responses in
              a testing environment."
                />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Development Practices</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="ESLint: Enforces coding standards and best
              practices."
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Prettier: Formats code for consistency." />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Husky: Automates pre-commit checks to maintain
              code quality."
                />
              </ListItem>
            </List>
          </Grid2>
        </Grid2>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="back">
          Backend Tech Stack
        </Typography>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Core Framework</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Spring Boot: A framework for building production-ready Java applications with minimal configuration." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Spring Security: Provides authentication and authorization mechanisms for securing applications." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Spring Data JPA: Simplifies database interactions with JPA repositories for managing entities." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Spring Web: A module for building web applications, including RESTful APIs." />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Database</Typography>
            <List>
              <ListItem>
                <ListItemText primary="PostgreSQL: A powerful relational database for managing logistics data." />
              </ListItem>
              <ListItem>
                <ListItemText primary="H2 Database: An in-memory database used for testing and development." />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">
              Authentication and Authorization
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="JWT (JSON Web Tokens): A compact token format
              used for secure user authentication and authorization."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="OAuth2: A protocol for token-based authorization
              to access resources securely."
                />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">API Development</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="REST API: Implements RESTful endpoints for
              handling CRUD operations and business logic."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="OpenAPI: Used to generate API documentation and
              provide detailed specifications."
                />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Testing and Quality Assurance</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="JUnit 5: A testing framework for writing unit
              tests to ensure functionality and quality."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Mockito: A mocking framework for creating mock
              objects in unit tests."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="SonarQube: A static code analysis tool for
              maintaining code quality and detecting bugs."
                />
              </ListItem>
            </List>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Development Practices</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Gradle: A build automation tool for managing
              dependencies, building, and deploying applications."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Lombok: A library for reducing boilerplate code
              in Java applications."
                />
              </ListItem>
            </List>
          </Grid2>
        </Grid2>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="other">
          Other Tech Stack
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="AI Integration"
              secondary="Custom AI Models to predict logistical needs based on historical data. Python for AI-related tasks and data analysis."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Deployment"
              secondary="IBM Cloud for cloud-based deployment."
            />
          </ListItem>
        </List>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="docs">
          Documentation and Resources
        </Typography>
        <Typography variant="body1">
          Links to docs and resources here
        </Typography>
      </section>

      <section>
        <Typography variant="h4" gutterBottom id="contact">
          Contact Me
        </Typography>
        <Typography variant="body1">Andrew Miller</Typography>
        <Typography variant="body1">Email link here</Typography>
        <Typography variant="body1">LinkedIn link here</Typography>
        <Typography variant="body1">GitHub link here</Typography>
      </section>
    </Container>
  );
}
