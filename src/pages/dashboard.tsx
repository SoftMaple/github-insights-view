import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Layout } from "@/components/layout";
import { MaterialUISwitch } from "@/components/material-ui-switch";
import { DashboardTabs } from "@/components/dashboard-tabs";
import type { Clone, View } from "@/types";
import dbConnect from "@/lib/db-connect";
import CloneModel from "@/models/clone";
import ViewModel from "@/models/view";
import type { GetStaticProps } from "next";

type DashboardProps = {
  clones: Clone[];
  views: View[];
};

export default function Dashboard({ clones, views }: DashboardProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const onChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Layout isDarkMode={isDarkMode}>
      <FormGroup>
        <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} />}
          label={isDarkMode ? "Dark Mode" : "Light Mode"}
          onChange={onChange}
        />
      </FormGroup>
      <DashboardTabs clones={clones} views={views} isDarkMode={isDarkMode} />
    </Layout>
  );
}

/**
 * This function gets called at build time on server-side.
 * It won't be called on client-side, so you can even do
 * direct database queries.
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching#technical-details
 */
export const getStaticProps: GetStaticProps = async () => {
  // TODO: optimize this, need error handler or try/catch
  await dbConnect();

  const originClones = await CloneModel.find(
    {},
    // exclude createdAt, updatedAt and __v fields
    {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }
  );

  const originViews = await ViewModel.find(
    {},
    // exclude createdAt, updatedAt and __v fields
    {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }
  );

  const clones = originClones.map((doc) => {
    const clone = doc.toObject();
    clone._id = clone._id.toString();
    return clone;
  });

  const views = originViews.map((doc) => {
    const view = doc.toObject();
    view._id = view._id.toString();
    return view;
  });

  // console.log("clones: ", clones);
  // console.log("views: ", views);

  return {
    props: {
      clones,
      views,
    },
  };
};
