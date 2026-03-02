# Contributing to Ostrzółka 🏛️

First of all, thank you for your interest in contributing to **Ostrzółka**! This project is a collective effort to map the Bydgoszcz historical records and it wouldn't be possible without the community.

Whether you are a developer, a historian, or a resident with a story to tell, there are many ways to help.

---

## Technical Contributions

Ostrzółka is built with a modern, high-performance stack (**Next.js, GSAP, Lenis, and Supabase**). Performance and smooth motion are top priorities.

### 1. Getting Started
* **Fork** the repository and clone it to your local machine.
* Create a feature branch: `git checkout -b feature/amazing-feature`.
* Install dependencies: `npm install` (or your preferred manager).

### 2. Development Standards
* **Styling:** Use **Tailwind CSS**. Avoid global CSS unless it's for complex GSAP timelines.
* **Animations:** We use **GSAP** for motion. Ensure animations are accessible.
* **Scrolling:** Since we use **Lenis**, be mindful of fixed positioning or scroll-jacking that might conflict with smooth inertial scrolling.
* **Database:** Any changes to the schema should be discussed in an Issue first, as they affect the **Supabase** backend.

### 3. Submitting a Pull Request (PR)
* Run `npm run build` to ensure there are no production errors.
* Provide a clear description of the changes.
* Link any related issues (e.g., `Closes #42`).
* Await review from the maintainer - most likely ([@JPacoch](https://github.com/JPacoch)).

---

<!-- ## Content & Historical Research

You don't need to write code to contribute to the archive. We are always looking for:

* **Data Entry:** Helping index addresses, old building functions, or historical figures.
* **Fact-Checking:** Correcting dates, names, or architectural styles in existing entries.
* **Sources:** Adding bibliographic references or links to digital archives (like KPBC).
* **Media:** Contributing high-quality, public-domain photographs of Bydgoszcz.

> **Note:** For large datasets or archival lists, please open an **Issue** first to discuss how to best structure the import.

--- -->

## Community Guidelines

As this is a project dedicated to the heritage of Bydgoszcz, we maintain a high standard of respect and accuracy:
* **Verify:** Provide sources for historical data whenever possible.
* **Collaborate:** Be helpful to newcomers and open to feedback.
* **Respect:** This is a non-political, historical, and civic project.

---

## Contact

The project is maintained by Jakub Pacocha. If you have questions about the technical roadmap or how to get involved in the research, feel free to:
* Open an Issue
* Reach out via GitHub: [@JPacoch](https://github.com/JPacoch).

---

*Thank you for helping us preserve the history of Bydgoszcz, one address at a time.*