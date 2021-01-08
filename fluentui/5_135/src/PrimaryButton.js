import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react';

const PrimaryButtonIndicator = (props = {}) => {
    const newProps = {
        ...props,
        text: `${props.text} (fabric v5)`
    }
    return <PrimaryButton {...newProps} />;
}

export { PrimaryButtonIndicator as PrimaryButton };
