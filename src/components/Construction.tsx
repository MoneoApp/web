import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { withBreakpoint } from '../utils/withBreakpoint';

export function Construction() {
  return (
    <StyledConstruction>
      <StyledIcon icon={faTools}/>
      Under construction, check back later
    </StyledConstruction>
  );
}

const StyledConstruction = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 10rem);

  ${withBreakpoint('tabletLandscape', css`
    height: calc(100vh - 15rem);
  `)};

  ${withBreakpoint('laptop', css`
    height: calc(100vh - 20rem);
  `)};
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-bottom: 2rem;
  font-size: 5rem;
`;
