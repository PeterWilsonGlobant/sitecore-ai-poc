import { RichText as ContentSdkRichText, Field } from '@sitecore-content-sdk/nextjs';
import React from 'react';

export interface RichTextProps {
  fields?: {
    Text?: Field<string>;
    text?: Field<string>;
  };
  params?: {
    [key: string]: string;
  };
}

export const RichText = ({ fields, params }: RichTextProps): React.JSX.Element => {
  // Sitecore SXA / standard templates typically name the rich text field 'Text' or 'text'
  const textField = fields?.Text || fields?.text;

  if (!textField) {
    return <></>;
  }

  return (
    <div className={`rich-text-container ${params?.GridParameters || ''} ${params?.Styles || ''}`}>
      <ContentSdkRichText field={textField} />
    </div>
  );
};

export default RichText;