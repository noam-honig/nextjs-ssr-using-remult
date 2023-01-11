import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { InferredType } from "remult";



export function getHelper<
  T,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData>(
    members: T
  ): HelperResult<T, Q, D> {
  return {

    functionComponent(func) {
      return (x: any) => {
        if (x.date) {
          x = { ...x, date: new Date(x.date) };
        }
        return func(x);
      };
    },
    serverProps(orig) {
      return async (context: GetServerSidePropsContext<Q, D>) => {
        const r: any = await orig(context);
        if (r.props.date) r.props.date = (r.props.date as Date).toISOString();
        return r;
      };
    },
  }
}

export interface HelperResult<P,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData> {
  serverProps(func: GetServerSideProps<InferredType<P>, Q, D>): GetServerSideProps<InferredType<P>, Q, D>
  functionComponent(func: React.FunctionComponent<InferredType<P>>): React.FunctionComponent<InferredType<P>>
}