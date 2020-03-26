USE [C84_InternsLA]
GO

/****** Object:  Table [dbo].[JobPostActivity]    Script Date: 3/26/2020 12:01:02 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[JobPostActivity](
	[UserId] [int] NOT NULL,
	[JobPostId] [int] NOT NULL,
	[ApplyDate] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[JobPostId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[JobPostActivity] ADD  CONSTRAINT [DF_JobPostActivity_ApplyDate]  DEFAULT (getutcdate()) FOR [ApplyDate]
GO

