USE [C84_InternsLA]
GO

/****** Object:  Table [dbo].[Openings]    Script Date: 3/26/2020 12:02:24 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Openings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationId] [int] NOT NULL,
	[JobTypeId] [int] NOT NULL,
	[LocationId] [int] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](4000) NOT NULL,
	[Requirements] [nvarchar](3000) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[ContactName] [nvarchar](100) NOT NULL,
	[ContactPhone] [nvarchar](20) NULL,
	[ContactEmail] [nvarchar](200) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Openings] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Openings] ADD  CONSTRAINT [DF_Openings_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO

ALTER TABLE [dbo].[Openings] ADD  CONSTRAINT [DF_Openings_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO

ALTER TABLE [dbo].[Openings]  WITH CHECK ADD  CONSTRAINT [FK_Openings_CreatedBy_Users_Id] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Openings] CHECK CONSTRAINT [FK_Openings_CreatedBy_Users_Id]
GO

ALTER TABLE [dbo].[Openings]  WITH CHECK ADD  CONSTRAINT [FK_Openings_JobTypeId_JobType_Id] FOREIGN KEY([JobTypeId])
REFERENCES [dbo].[JobType] ([Id])
GO

ALTER TABLE [dbo].[Openings] CHECK CONSTRAINT [FK_Openings_JobTypeId_JobType_Id]
GO

ALTER TABLE [dbo].[Openings]  WITH CHECK ADD  CONSTRAINT [FK_Openings_LocationId_Locations_Id] FOREIGN KEY([LocationId])
REFERENCES [dbo].[Locations] ([Id])
GO

ALTER TABLE [dbo].[Openings] CHECK CONSTRAINT [FK_Openings_LocationId_Locations_Id]
GO

ALTER TABLE [dbo].[Openings]  WITH CHECK ADD  CONSTRAINT [FK_Openings_OrganizationId_Organizations_Id] FOREIGN KEY([OrganizationId])
REFERENCES [dbo].[Organizations] ([Id])
GO

ALTER TABLE [dbo].[Openings] CHECK CONSTRAINT [FK_Openings_OrganizationId_Organizations_Id]
GO

