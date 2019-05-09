import React from 'react';
import styled from 'styled-components';

import translate from 'translations';
import { BREAK_POINTS } from 'v2/features/constants';
import NotificationWrapper from './NotificationWrapper';

// Legacy
import champagneIcon from 'common/assets/images/icn-champagne-2.svg';
import howBuyIcon from 'common/assets/images/icn-how-do-i-buy-crypto.svg';
import dontLoseCryptoIcon from 'common/assets/images/icn-don-t-lose-crypto.svg';
import questionsIcon from 'common/assets/images/icn-questions.svg';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;

const ChampagneImage = styled.img`
  width: 71px;
  height: 70px;
  transform: rotateY(180deg);
  margin-right: 30px;

  @media (max-width: ${SCREEN_MD}) {
    display: none;
  }
`;

const ResourceItemWrapper = styled.a`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 140px;
  font-weight: normal;
  font-size: 16px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 12px;
    max-width: 105px;
  }
`;

const Image = styled.img`
  width: 50px;
  height: 51px;
  margin-bottom: 10px;
`;

interface ResourceItemProps {
  src: string;
  title: React.ReactElement<any>;
  link: string;
}

const ResourceItem: React.SFC<ResourceItemProps> = ({ src, title, link }) => {
  return (
    <ResourceItemWrapper href={link} target="_blank" rel="noopener noreferrer">
      <Image src={src} />
      {title}
    </ResourceItemWrapper>
  );
};

const getResources = () => {
  return (
    <>
      <ResourceItem
        src={howBuyIcon}
        title={translate('NOTIFICATIONS_WALLET_RESOURCE_BUY')}
        link="/how-to-buy"
      />
      <ResourceItem
        src={dontLoseCryptoIcon}
        title={translate('NOTIFICATIONS_WALLET_RESOURCE_LOSE')}
        link="/dont-lose-crypto"
      />
      <ResourceItem
        src={questionsIcon}
        title={translate('NOTIFICATIONS_WALLET_RESOURCE_SUPPORT')}
        link="https://support.mycrypto.com/"
      />
    </>
  );
};

interface NotificationProps {
  address: string;
}

export default function WalletCreatedNotification({ address }: NotificationProps) {
  return (
    <NotificationWrapper
      alignCenterOnSmallScreen={true}
      leftImg={<ChampagneImage src={champagneIcon} />}
      title={translate('NOTIFICATIONS_WALLET_ADDED_TITLE')}
      description={translate('NOTIFICATIONS_WALLET_ADDED_DESCRIPTION', {
        $address: address
      })}
      additionalDescription={translate('NOTIFICATIONS_WALLET_DESCRIPTION_ADD')}
      resources={getResources()}
    />
  );
}