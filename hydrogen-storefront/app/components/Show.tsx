import { Children, ReactNode } from "react";

interface ShowProps {
    children: ReactNode;
}

interface WhenProps {
    isTrue: boolean;
    children: ReactNode;
}

export const Show = (props: ShowProps) => {
    let when: ReactNode | null = null;
    let otherwise: ReactNode | null = null;

    Children.forEach(props.children, (child) => {
        const children = child as React.ReactElement<WhenProps>;
        if (children.props.isTrue === undefined) {
            otherwise = children;
        } else if (!when && children.props.isTrue) {
            when = children;
        }
    });

    return when || otherwise;
};

Show.When = ({ isTrue, children }: WhenProps) => isTrue && children;
Show.Else = ({ children }: ShowProps) => children;