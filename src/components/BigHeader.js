import React from "react";

import styles from './BigHeader.module.css';

const BigHeader = (props) => {
    return (
      <div className={styles.header}>
        <div>
          <img alt="Interlochen Arts Academy" src="iaa-logo.png" width="200" />
        </div>
        <div>
          <h1 className={styles.title}>Aid Optimizer</h1>
        </div>
      </div>
    );
}

export default BigHeader;
