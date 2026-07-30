'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import ResolvedImage from '@/components/ResolvedImage';
import { BlogPost } from '@/data/homeData';

interface LatestBlogsProps {
  blogs: BlogPost[];
}

export const LatestBlogs: React.FC<LatestBlogsProps> = ({ blogs }) => {
  return (
    <section className="bg-white py-20 text-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
              TRAVEL INSPIRATION
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
              Latest Blogs & Travel Guides
            </h2>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md transition-all hover:bg-slate-900 hover:text-white"
          >
            <span>View All Blogs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-50 shadow-md transition-all duration-300 hover:bg-white hover:border-teal-500/40 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <ResolvedImage
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                <span className="absolute top-4 left-4 rounded-full bg-teal-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-600 transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
