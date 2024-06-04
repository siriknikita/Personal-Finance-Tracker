import React from "react";
import { Helmet } from "react-helmet";
import { BehaviourBarChart, Header } from "../../components";

function AdminDashboard() {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Header title="Dashboard" subtitle="Welcome to your admin dashboard" />
      <div className="w-screen h-screen">
        <section
          className="py-12 pb-8 grid gap-8"
          // style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"
        >
          <div class="bg-white h-40 flex items-center justify-start px-12 border border-gray-200 rounded">
            <div class="block w-12 h-12 fill-current text-gray-400">
              <BehaviourBarChart />
            </div>
            <div class="pl-5 whitespace-nowrap">
              <span class="block text-2xl leading-loose text-gray-900">
                Users' behaviour
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminDashboard;
