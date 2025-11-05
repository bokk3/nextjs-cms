import { ProjectService } from '@/lib/project-service'
import { HomepageClient } from './homepage-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | Custom Artisan Work',
  description: 'Discover unique custom projects and artisan work. Browse our portfolio of handcrafted pieces made with quality materials and attention to detail.',
  openGraph: {
    title: 'Portfolio | Custom Artisan Work',
    description: 'Discover unique custom projects and artisan work. Browse our portfolio of handcrafted pieces made with quality materials and attention to detail.',
    type: 'website',
  },
}

export default async function Home() {
  // Fetch featured projects for the homepage
  const featuredProjects = await ProjectService.getFeaturedProjects()
  
  return <HomepageClient featuredProjects={featuredProjects} />
}
