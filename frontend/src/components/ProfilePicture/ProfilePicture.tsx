import React from 'react';
import styles from './ProfilePicture.module.css';

interface ProfilePictureProps {
  src: string;
  imageType: string;
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  imageType,
  className,
}) => {
  return (
    <div className={`${styles.profileImgContainer} ${className ?? ''}`}>
      <img src={src} alt={`${imageType} Profile Image`} />
    </div>
  );
};

export default ProfilePicture;
