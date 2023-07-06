import React from "react";
type PlayerProps = {
    basePath: string;
    data: FSS.Track[];
    title: string;
    yearsDirectory?: boolean;
};
export default function Player({ data, title: titleFromProps, basePath, yearsDirectory }: PlayerProps): React.JSX.Element;
export {};
