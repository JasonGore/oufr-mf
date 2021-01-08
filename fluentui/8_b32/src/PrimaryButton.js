import * as React from 'react';
import { PrimaryButton } from '@fluentui/react';

const PrimaryButtonIndicator = (props = {}) => {
    const newProps = {
        ...props,
        text: `${props.text} (fluentui v8)`
    }
    return <PrimaryButton {...newProps} />;
}

export { PrimaryButtonIndicator as PrimaryButton };
