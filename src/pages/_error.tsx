import styled from '@emotion/styled';
import { NextPageContext } from 'next';

import { Empty } from '../components/templates/Empty';

type Props = {
  statusCode?: number;
};

export default function Error({ statusCode }: Props) {
  return (
    <StyledMessage>
      ¯\_({statusCode})_/¯
    </StyledMessage>
  );
}

Error.template = Empty;

Error.getInitialProps = ({ res, err }: NextPageContext) => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 404
});

const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
`;
