import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import styles from "./index.module.css";

const Icon = require("@site/static/img/nos.png").default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("", styles.heroBanner)}>
      <div className={styles.heroContentContainer}>
        <img className={styles.heroIcon} src={Icon} alt="NOS Icon" />
        <div className={styles.heroTitleWrapper} data-text={siteConfig.title}>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        </div>
        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <Link to="/docs/getting-started" className={styles.heroButton}>
          Get Started
        </Link>
      </div>
    </header>
  );
}

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Welcome"
      description="A lightweight, fast version-checking library for React Native, powered by Nitro Modules."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
