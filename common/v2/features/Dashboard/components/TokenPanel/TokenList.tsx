import React from 'react';
import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { convertToFiat } from 'v2/utils';
import { AssetWithDetails } from 'v2/types/asset';

import moreIcon from 'common/assets/images/icn-more.svg';

const defaultTokenIcon = 'https://via.placeholder.com/28';

const TokenListWrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const Token = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
`;

const Asset = styled.div`
  display: flex;
  align-items: center;
`;

const AssetName = styled(Typography)`
  margin: 0 0 0 15px !important;
  font-weight: normal;
  font-size: 14px;
`;

const TokenValueWrapper = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
`;

const TokenValue = styled(Typography)`
  margin: 0 15px 0 0 !important;
  font-weight: normal;
  font-size: 16px;
`;

const MoreIcon = styled.img`
  cursor: pointer;
`;

const TokenIcon = styled.img`
  width: 26px;
  height: 26px;
  margin-right: 8px;
`;

interface TokenListProps {
  tokens: AssetWithDetails[];
  setShowDetailsView(show: boolean): void;
  setCurrentToken(token: AssetWithDetails): void;
}

export function TokenList(props: TokenListProps) {
  const { setShowDetailsView, setCurrentToken, tokens } = props;
  return (
    <TokenListWrapper>
      {tokens.map(token => (
        <Token key={token.name}>
          <Asset>
            <TokenIcon
              src={
                token.details.logo ? token.details.logo.src || defaultTokenIcon : defaultTokenIcon
              }
              alt={name}
            />
            <AssetName>{token.name}</AssetName>
          </Asset>
          <TokenValueWrapper>
            <TokenValue>${convertToFiat(token.balance, token.rate).toFixed(2)}</TokenValue>
            <MoreIcon
              src={moreIcon}
              alt="More"
              onClick={() => {
                setShowDetailsView(true);
                setCurrentToken(token);
              }}
            />
          </TokenValueWrapper>
        </Token>
      ))}
    </TokenListWrapper>
  );
}