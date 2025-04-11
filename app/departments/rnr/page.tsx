'use client'

import React from 'react'
import { Users, Heart, Target, Star } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DepartmentLeaders } from "@/components/department-leaders"

// Department data
const department = {
  id: "rnr",
  name: "FCRP RECRUITMENT & RETENTION",
  description: "Building and nurturing our community's future",
  memberCount: 1,
  icon: Users,
  color: "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300",
  textColor: "text-blue-500 dark:text-blue-400",
  accentColor: "bg-blue-600 hover:bg-blue-700",
  subdivisions: [""],
  aboutUs: `Looking for a Department That Makes an Impact? Join FCRP Recruitment & Retention Team!

Are you passionate about connecting people with opportunities? Do you thrive on building relationships, solving challenges, and creating an environment where people want to stay and grow? Then a career in Recruitment & Retention is calling your name!

Why Recruitment & Retention?

Be the Face for Growth: Every organization's success begins with its people. As a Recruitment & Retention Team Member, you play a pivotal role in shaping the community. Build Meaningful Relationships: This department is all about people. Whether it's finding the perfect candidate or ensuring a valued employee feels supported, you'll build connections that last a lifetime. High Demand, Endless Opportunities: Recruitment and Retention are among the most in-demand skills today. Mastering this craft opens doors to industries across the globe, giving you a world of opportunities.

Why Join Us?

Inspiring Workplace: We believe in practicing what we preach—our own team culture is rooted in collaboration, recognition, and growth. Support for Your Success: Get access to cutting-edge tools, professional development resources, and mentorship to become a leader in our department. Make an Impact: Your work will directly impact people's lives and contribute to the community success story.

What Makes Our Team Special?

Supportive Leadership: We believe in teamwork and mentorship, ensuring you have the tools and guidance to succeed in your role. Be a Part of Something Bigger: Your efforts will ensure the continued growth and success of a vibrant, inclusive roleplay community where creativity thrives.`,
  missionStatement: `Our mission is to attract, develop, and retain exceptional talent while fostering an inclusive and engaging community environment. We are dedicated to building meaningful connections, supporting professional growth, and ensuring the long-term success of our members through innovative recruitment strategies and comprehensive retention programs.`,
  requirements: [
    "18+ years old",
    "Strong communication skills",
    "Passion for community building",
    "Clean record on the server"
  ],
  leaders: [
    { profileId: 0, title: "Director of Recruitment & Retention" },
    { profileId: 0, title: "Deputy Director" },
    { profileId: 0, title: "Senior Recruitment Officer" },
    { profileId: 0, title: "Senior Retention Specialist" },
  ],
  keyRoles: [
    {
      name: "Community Building",
      description: "Foster a vibrant and inclusive community where members can thrive and grow together.",
      icon: Heart,
    },
    {
      name: "Career Development",
      description: "Provide comprehensive training and mentorship programs to help members achieve their professional goals.",
      icon: Target,
    },
    {
      name: "Member Success",
      description: "Ensure long-term member satisfaction through personalized support and engagement initiatives.",
      icon: Star,
    },
  ],
}

export default function DepartmentPage() {
  const DeptIcon = department.icon

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Departments", href: "/departments" },
    { label: "Recruitment & Retention" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Banner */}
        <div className="relative w-full h-[300px] md:h-[250px] rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <div className="flex items-center gap-4 mb-4">
              <DeptIcon className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">{department.name}</h1>
            <p className="text-xl text-gray-200 text-center max-w-2xl">{department.description}</p>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <span className="text-blue-500">About</span> Us
            </h2>
            <div className="h-1 w-24 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-start">
            <div className="lg:col-span-5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                {department.aboutUs}
              </p>
            </div>

            <div className="lg:col-span-2 flex flex-col items-center justify-center">
              {/* Join Our Team */}
              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm text-center w-full">
                <h3 className="text-2xl font-bold text-blue-500 mb-4">YOUR Future STARTS Here</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-6">
                  Ready to start the journey? Join the Recruitment & Retention movement!
                </p>
                <Link
                  href={`/apply?department=${department.id}`}
                  className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-lg"
                >
                  APPLY HERE
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement and Leadership Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission Statement */}
            <div className="lg:col-span-2">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  <span className="text-blue-500">Mission</span> Statement
                </h2>
                <div className="h-1 w-24 bg-blue-500 mx-auto"></div>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg italic">
                  {department.missionStatement}
                </p>
              </div>
            </div>

            {/* Leadership */}
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  <span className="text-blue-500">Department</span> Leadership
                </h2>
                <div className="h-1 w-24 bg-blue-500 mx-auto"></div>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <DepartmentLeaders leaders={department.leaders} />
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <span className="text-blue-500">Key</span> Roles
            </h2>
            <div className="h-1 w-24 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {department.keyRoles.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm"
              >
                <div className="flex flex-col items-center text-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{feature.name}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
