'use client';

import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { Reveal } from '@/components/ui/Reveal';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { CheckIcon, SpinnerIcon } from '@/components/ui/icons';

type Status = 'idle' | 'loading' | 'sent';
type ModalVariant = 'success' | 'error' | null;

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [modalVariant, setModalVariant] = useState<ModalVariant>(null);
  const [toastOpen, setToastOpen] = useState(false);

  function resetForm() {
    setName('');
    setEmail('');
    setMessage('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setModalVariant('error');
      return;
    }

    setStatus('loading');

    // No backend wired up yet, so this simulates the round trip. Swap this block for a real
    // fetch() call once there's an API route or a form service (Resend, Formspree, etc.) behind it.
    window.setTimeout(() => setStatus('sent'), 900);
    window.setTimeout(() => {
      resetForm();
      setModalVariant('success');
      setToastOpen(true);
      setStatus('idle');
    }, 1500);
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something together."
              description="Have a project in mind or just want to say hello? Send a message or reach out directly."
            />

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="text-foreground hover:text-accent ease-swift block text-lg font-medium transition-colors duration-200"
              >
                {profile.email}
              </a>
              <p className="text-muted text-sm">{profile.location}</p>
              <SocialLinks links={profile.social} />
            </div>
          </Reveal>

          <Reveal variant="right">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FloatingInput label="Name" name="name" required value={name} onChange={setName} />
                <FloatingInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                />
              </div>

              <FloatingInput
                label="Message"
                name="message"
                required
                multiline
                value={message}
                onChange={setMessage}
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  showArrow={false}
                  disabled={status !== 'idle'}
                  className="disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {status === 'loading' && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-2"
                    >
                      <SpinnerIcon className="h-4 w-4 animate-spin" />
                      Sending...
                    </motion.span>
                  )}
                  {status === 'sent' && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Message Sent
                    </motion.span>
                  )}
                  {status === 'idle' && 'Send Message'}
                </Button>
              </div>

              <p className="text-muted text-xs">I read every message myself and reply within a day or two.</p>
            </form>
          </Reveal>
        </div>
      </Container>

      <Modal
        open={modalVariant === 'success'}
        onClose={() => setModalVariant(null)}
        variant="success"
        title="Message Sent Successfully"
        description="Thank you for reaching out. I'll get back to you as soon as possible."
        actionLabel="Close"
      />

      <Modal
        open={modalVariant === 'error'}
        onClose={() => setModalVariant(null)}
        variant="error"
        title="Message Failed"
        description="Something went wrong. Please try again."
        actionLabel="Try Again"
      />

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        title="Message Sent Successfully"
        description="Thanks for contacting me."
      />
    </section>
  );
}
