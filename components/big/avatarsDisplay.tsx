import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function AvatarsDisplay({ images, numberUsers }: { images?: { name: string, image: string }[], numberUsers?: number }) {
    const skeleton = (images === undefined && numberUsers === undefined);

    return (
        <div className="flex justify-center items-center space-x-2">
            <div className={`flex -space-x-4 ${skeleton ? 'animate-pulse' : ''}`}>
                {
                    skeleton ?
                        Array(5).fill(null).map((_, i) => (
                            <div key={i} className="size-12 bg-gray-200 rounded-full border border-black"></div>
                        ))
                        :
                        images?.map((image, i) => (
                            <Avatar className="size-12" key={i}>
                                <AvatarImage src={image.image} />
                                <AvatarFallback>
                                    {
                                        image.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                    }
                                </AvatarFallback>
                            </Avatar>
                        ))
                }
            </div>
            <p>
                Already <span className="font-bold">{skeleton ? 'X' : numberUsers}</span> users trust us
            </p>
        </div>
    )
}