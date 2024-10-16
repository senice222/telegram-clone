export interface Group {
    id: string
    name: string
    image: string
    createdAt: string
    updatedAt: string
    ownerId: string
    type: string
    owner: Owner
    members: Member[]
    messages: any[]
}

export interface Owner {
    id: string
    userId: string
    name: string
    imageUrl: string
    email: string
    createdAt: string
    updatedAt: string
    type: string
    lastSeen: string
}

export interface Member {
    id: string
    groupId: string
    memberId: string
}