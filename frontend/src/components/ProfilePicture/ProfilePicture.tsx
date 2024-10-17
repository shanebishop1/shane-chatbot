import React from 'react';
import styles from './ProfilePicture.module.css';
import { useUserInfo } from '../../context/userInfoContext';
import { UserInfoContextType } from '../../types/types';

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
  const userInfo: UserInfoContextType = useUserInfo();
  return (
    <div className={`${styles.profileImgContainer} ${className ?? ''}`}>
      {imageType === 'User' ? (
        <div className={styles.initialProfileImg}>
          {userInfo.email.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img src={src} alt={`${imageType} Profile Image`} />
      )}
    </div>
  );
};

export default ProfilePicture;
