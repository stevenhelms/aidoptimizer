import React from 'react';

import appLogo from '../../assets/iaa-logo.png';
import styles from './Logo.module.css';

const Logo = (props) => (
    <div className={styles.Logo}>
        <img src={appLogo} alt="Interlochen Arts Academy" />
    </div>
);

export default Logo;