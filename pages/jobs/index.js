import { useContext, useState } from "react";
import NavBar from "../../components/navigation/NavBar";
import Container from "../../components/layout/Container";
import JobsContext from "../../context/JobsContext";
import JobPostItem from "../../components/navigation/JobPostItem";
import Footer from "../../components/Footer";
import Head from "../../components/Head";
import Filter from "../../components/navigation/Filter";
import AnnouncementHero from "../../components/campaigns/AnnoucementHero";
import Empty from "../../components/illustrations/empty";

export default function JobsIndexPage() {
  const { navItems } = useContext(JobsContext);
  navItems.map((job) => {
    if (new Date() > new Date(job.closingOn)) {
      navItems.splice(job, 1);
    }
  });
  const [filter, setFilter] = useState(null);
  const [posts, setPosts] = useState(
    navItems.sort((i1, i2) => {
      const i1Date = new Date(i1.date);
      const i2Date = new Date(i2.date);
      return i2Date - i1Date;
    })
  );

  const onFilter = (data) => {
    setPosts(data);
  };
  const toFilter = [
    {
      name: "category",
    },
  ];
const body = `---
title: 'Job Title'
date: MM/DD/YYYY (current date)
category: job category
closingOn: MM/DD/YYYY
contact: provide link to oryginal job posting or a contact email address
company: 
  name: 'YourCompanyName'
  logoUrl: /img/logos/companies/YourCompanyName.png
  # Add your image in /pages/img/logos/companies
---
## About the team
Let potential employees knows what it'll feel like to joining your team in this section
## TL;DR
Enter list of perks for potential employees in this section.
E.g.
* :muscle: Growing team
* :house_with_garden: Fully remote job
* :money_mouth_face: Great salary and compensation package
* :mountain_snow: Unlimited paid time off
## About the job
Let the potential employee knows about the job in this section
## About you
The potential employees would love to know more about you. Tell them more about you in this section
## Pay and benefits
Let the potential employees knows what comes with joining your team in this section.
Join us!
`;
const jobPostUrl = encodeURIComponent(body);
  const hasPosts = Object.keys(posts).length;
  return (
    <div>
      <Head title="Jobs" rssTitle="RSS Feed for AsyncAPI Initiative Jobs Board" rssLink = "/jobs/rss.xml" />
      <Container>
        <NavBar />
      </Container>
      <AnnouncementHero className="text-center m-4" small={true} />
      <div className="relative pt-8 pb-20 px-4 sm:px-6 lg:pt-12 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
              Job Postings
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">
              Want to work on a great open-source project with a lovely team and
              a vibrant community? Browse through available job offers!
            </p>
            <p className="max-w-2xl mx-auto text-md leading-7 text-gray-400">
              <span role="img">💡</span> Want to post a job offer?{" "}
              <a
                className="ml-1 text-primary-500 hover:text-primary-400"
                href={`https://github.com/asyncapi/website/new/master/pages/jobs?value=${jobPostUrl}`}
                target="_blank"
              >
                Post it now!
              </a>
            </p>
            <p className="max-w-2xl mx-auto text-md leading-7 text-gray-400">
              {" "}
              Do you want to discuss your job offer first?
              <a
                className="ml-1 text-primary-500 hover:text-primary-400"
                href="https://github.com/asyncapi/website/issues/new"
                target="_blank"
              >
                Get started here.
              </a>
            </p>
            <p className="max-w-2xl mx-auto text-md leading-7 text-gray-400">
              We have an <img className="ml-1 text-primary-500 hover:text-primary-400" style={{ display: 'inline' }} src="/img/logos/rss.svg" height="18px" width="18px" /> <a className="ml-1 text-primary-500 hover:text-primary-400" href="jobs/rss.xml">RSS Feed</a> too!
            </p>
          </div>
          <div className="text-center">
            {!hasPosts ? (
              <div className="flex content-center justify-center">
                <div>
                  <Empty />
                  <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500">
                    No open positions currently. Check back later
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-stretch sm:rounded-md text-left">
                <div className="divide-y divide-gray-200 mb-2 sm:w-2/3 sm:self-center">
                  <Filter
                    className="w-full inline-flex mx-px justify-center sm:mt-0 sm:w-1/5 sm:text-sm"
                    data={navItems}
                    onFilter={onFilter}
                    filter={filter}
                    setFilter={setFilter}
                    checks={toFilter}
                  />
                </div>
                <ul className="bg-white shadow overflow-hidden divide-y divide-gray-200 sm:w-2/3 sm:self-center">
                  {posts.map((post, index) => (
                    <JobPostItem key={index} job={post} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
