"use client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-hooks";
import InputFile from "../file-input";
import { axiosInstance } from "@/core/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateGroup } from "@/hooks/useCreateGroup";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required.",
    }),
    description: z.string().optional(),
});

const CreateGroupModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { groupMembers, profile, setIsCreatingGroup } = data
    const [file, setFile] = useState<File | null>(null);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        },
    });
    const router = useRouter();
    const isModalOpen = isOpen && type === "createGroup";
    const isLoading = form.formState.isSubmitting;
    const { mutate: createGroup } = useCreateGroup(() => {
        router.refresh();
        onClose();
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (profile && setIsCreatingGroup) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('ownerId', profile.id);
                if (file) {
                    console.log("file:", file)
                    formData.append('image', file);
                }
                formData.append('members', JSON.stringify(groupMembers));
                createGroup(formData);
                setIsCreatingGroup(false)
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose()
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-[40vw]">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-medium">
                        Create group
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-5 px-6">
                            <InputFile file={file} setFile={setFile} />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-medium text-black dark:text-secondary/70">
                                            Group name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black placeholder:text-zinc-500 focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <h3 className="font-medium">{groupMembers?.length} member</h3>
                                {
                                    groupMembers?.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-2 text-sm text-zinc-600 mt-1"
                                        >
                                            <img
                                                src={member.imageUrl}
                                                alt={member.name}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                            {member.name}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" className="rounded-[6px]" size={"default"} disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModal;
