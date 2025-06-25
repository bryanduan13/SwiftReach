import { useCreateClient } from '@/hooks/useApi';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const CreateLeadForm = () => {
  const createClient = useCreateClient();
  const form = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createClient.mutateAsync(data);
      toast.success('Lead created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create lead');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};