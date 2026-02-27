'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, Server, Database, Cloud, Zap, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const services = [
  {
    name: 'Web Application',
    status: 'operational',
    uptime: '99.99%',
    icon: Globe,
    description: 'Main web interface',
  },
  {
    name: 'PDF Processing API',
    status: 'operational',
    uptime: '99.95%',
    icon: Zap,
    description: 'Client-side processing engine',
  },
  {
    name: 'Cloud Workers',
    status: 'operational',
    uptime: '99.90%',
    icon: Cloud,
    description: 'Server-side processing',
  },
  {
    name: 'Database',
    status: 'operational',
    uptime: '99.99%',
    icon: Database,
    description: 'User data and jobs storage',
  },
  {
    name: 'File Storage',
    status: 'operational',
    uptime: '99.99%',
    icon: Server,
    description: 'Temporary file storage',
  },
  {
    name: 'AI Services',
    status: 'operational',
    uptime: '99.85%',
    icon: Zap,
    description: 'AI document processing',
  },
];

const incidents = [
  {
    date: '2026-02-20',
    title: 'Scheduled Maintenance',
    status: 'resolved',
    description: 'Routine infrastructure maintenance completed successfully.',
  },
  {
    date: '2026-02-15',
    title: 'Minor API Latency',
    status: 'resolved',
    description: 'Increased response times for cloud processing. Resolved within 30 minutes.',
  },
];

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === 'operational');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className={`py-16 ${allOperational ? 'bg-green-500/5' : 'bg-amber-500/5'}`}>
          <div className="page-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                allOperational ? 'bg-green-500/10' : 'bg-amber-500/10'
              }`}>
                {allOperational ? (
                  <CheckCircle className="w-10 h-10 text-green-500" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                )}
              </div>
              <h1 className="heading-1 mb-4">
                {allOperational ? (
                  <span className="text-green-600 dark:text-green-400">All Systems Operational</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">Partial Degradation</span>
                )}
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="section">
          <div className="page-container">
            <h2 className="heading-3 mb-6">Services Status</h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      {service.uptime} uptime
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === 'operational'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        service.status === 'operational' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                      {service.status === 'operational' ? 'Operational' : 'Degraded'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Incidents */}
        <section className="section bg-muted/30">
          <div className="page-container">
            <h2 className="heading-3 mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{incident.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      incident.status === 'resolved'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    {incident.date}
                  </div>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="section">
          <div className="page-container">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="heading-3 mb-4">Subscribe to Updates</h2>
              <p className="text-muted-foreground mb-6">
                Get notified when incidents occur or when we publish maintenance updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 rounded-xl btn-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
