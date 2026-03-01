import Heading from "@theme/Heading";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  emoji: string;
  description: React.ReactElement;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Blazing Fast",
    emoji: "\u26A1",
    description: (
      <>
        Built on <b>Nitro Modules</b> for direct native access. Up to <b>3.1x faster</b> than the original library —
        sync properties have zero bridge overhead.
      </>
    ),
  },
  {
    title: "Drop-in Replacement",
    emoji: "\uD83D\uDD04",
    description: (
      <>
        Swap out <code>react-native-version-check</code> with minimal code changes. Same APIs you know, but faster and
        actively maintained.
      </>
    ),
  },
  {
    title: "Smart Update Checks",
    emoji: "\uD83D\uDD0D",
    description: (
      <>
        Granular update detection — check for <b>major</b>, <b>minor</b>, or <b>patch</b> updates separately. Detect
        install source (App Store, TestFlight, Play Store).
      </>
    ),
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <span className={styles.featureEmoji}>{emoji}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.title}>
          {title}
        </Heading>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
