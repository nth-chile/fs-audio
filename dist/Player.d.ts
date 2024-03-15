import React from "react";
export type PlayerProps = {
    backPath: string;
    basePath: string;
    data: FSS.Track[];
    title: string;
    yearsDirectory?: boolean;
};
export default function Player({ data, title: titleFromProps, basePath, backPath, yearsDirectory, }: PlayerProps): React.JSX.Element;
