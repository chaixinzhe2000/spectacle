import React from 'react';
import {  Breadcrumbs, IBreadcrumbProps, Breadcrumb } from '@blueprintjs/core';
import {IFilePath, IServiceResponse} from 'hypertext-interfaces';
import INode, { ROOT_ID, ROOT_LABEL } from 'hypertext-interfaces/dist/INode';


interface FileLocationProps {
  filePath: IFilePath
  onClick: (rid: string) => void
  getNode: (nid: string) => IServiceResponse<INode>
  appendRoot?: boolean
}

function FileLocation(props: FileLocationProps) {

  let fpString: string[] = props.filePath ? [...props.filePath.filePath] : []
  if (props.appendRoot && (fpString[0] !== ROOT_ID) || fpString.length === 0)  {
    fpString.unshift(ROOT_ID)
  }

  const BREADCRUMBS: IBreadcrumbProps[] = fpString.map((val: string) => {
    return {
      text: val === ROOT_ID ?  `${ROOT_LABEL} (${ROOT_ID})` : `${props.getNode(val).success ? props.getNode(val).payload.label : ''} (${val})`,
      onClick: val === ROOT_ID ?  () => props.onClick("") : () => props.onClick(val)
    }
  })


  return (
    <>  
      <Breadcrumbs
        currentBreadcrumbRenderer={({ text, ...restProps }: IBreadcrumbProps) => {
          return <Breadcrumb {...restProps}>{text}</Breadcrumb>
          } }
                items={BREADCRUMBS}
      />
    </>
  );
} 


export default FileLocation;
