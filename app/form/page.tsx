"use client"
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    name: string;
    email: string;
    linkedin: string;
    resume: FileList;
    skills: string;
    jobDescription: string;
}

export default function Home() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    // const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);


    const onSubmit = async (data: FormData) => {
        setLoading(true);
        console.log(data);
        try {
            // Handle form submission
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('linkedin', data.linkedin);
            formData.append('resume', data.resume[0]);
            formData.append('skills', data.skills);
            formData.append('jobDescription', 'Software Engineer');


            const response = await axios.post('/api/sohan', formData, 
            { headers: { 'Content-Type': 'multipart/form-data' } }

            )

            const responseResult = await response.data;
            console.log(responseResult);

            if(responseResult.success) {
                toast.success('Resume submitted successfully');
                console.log(responseResult.resumeText);
                await setCookie('email', responseResult.email);
                // router.push('/evaluation');
            } else {
                toast.error(responseResult.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.error('Failed to submit resume');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex mx-auto justify-center mt-20 w-full h-full ">
            <Card className='p-10'>
                <CardHeader className='text-center text-3xl font-bold mb-10'>Submit Resume</CardHeader>
                <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <Label>Name<span className='text-red-500'>*</span></Label>
                    <Input type="text" {...register('name', { required: true })} />
                    {errors.name && <span className='text-red-500'>Name is required</span>}

                    <Label>Email<span className='text-red-500'>*</span></Label>
                    <Input type="email" {...register('email', { required: true })} />
                    {errors.email && <span className='text-red-500'>Email is required</span>}

                    <Label>LinkedIn<span className='text-red-500'>*</span></Label>
                    <Input type="text" {...register('linkedin', { required: true })} />
                    {errors.linkedin && <span className='text-red-500'>Linkedin URL is required</span>}

                    <Input type="file" accept=".pdf" max={1} {...register('resume', { required: true })} />
                    {errors.resume && <span className='text-red-500'>Resume is required</span>}

                    <Label>Skills<span className='text-red-500'>*</span></Label>
                    <Input type="text" {...register('skills', { required: true })} />
                    {errors.skills && <span className='text-red-500'>Skills is required</span>}
                    <Label>Job Description</Label>
                    <Input type="text" {...register('jobDescription')} />
                    {errors.jobDescription && <span className='text-red-500'> Job Description is required</span>}
                    <Button className='mt-3'>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}